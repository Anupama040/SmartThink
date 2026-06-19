package com.example.demo.config;

import com.example.demo.model.*;
import com.example.demo.model.enums.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AptitudeCategoryRepository categoryRepository;
    private final AptitudeTopicRepository topicRepository;
    private final AptitudeQuestionRepository questionRepository;
    private final ForumPostRepository forumPostRepository;
    private final ForumCommentRepository forumCommentRepository;
    private final CodingProblemRepository codingProblemRepository;
    private final TestCaseRepository testCaseRepository;
    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        User admin = userRepository.findByEmail("admin@smartthink.com").orElse(null);
        if (admin == null) {
            admin = User.builder()
                    .firstName("Super")
                    .lastName("Admin")
                    .email("admin@smartthink.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            admin = userRepository.save(admin);
        }

        if (forumPostRepository.count() == 0) {
            ForumPost post1 = forumPostRepository.save(ForumPost.builder()
                    .author(admin)
                    .title("Welcome to the SmartThink Community!")
                    .content("Feel free to ask any doubts regarding placement preparation, aptitude tests, or interview experiences here.")
                    .tags("General,Welcome")
                    .upvotes(10)
                    .build());
            
            ForumPost post2 = forumPostRepository.save(ForumPost.builder()
                    .author(admin)
                    .title("How to tackle Time and Work problems efficiently?")
                    .content("I always struggle with Time and Work problems when fractions are involved. Does anyone have a good shortcut?")
                    .tags("Quant,Aptitude,Help")
                    .upvotes(5)
                    .build());

            forumCommentRepository.save(ForumComment.builder()
                    .post(post2)
                    .author(admin)
                    .content("Use the LCM method instead of fractions! Assume total work = LCM of days.")
                    .build());
        }

        long qCount = questionRepository.count();
        boolean needsUpdate = false;
        if (qCount > 0 && topicRepository.count() > 0) {
            AptitudeTopic sampleTopic = topicRepository.findAll().get(0);
            if (sampleTopic.getFormulaNotes() == null || sampleTopic.getFormulaNotes().isEmpty()) {
                needsUpdate = true;
            }
        }

        if (qCount < 40 || needsUpdate) {
            System.out.println("Initiating clean database seed for IndiaBix style mock data...");
            // Wipe existing aptitude data to avoid duplicates
            jdbcTemplate.execute("TRUNCATE TABLE aptitude_categories CASCADE");

            AptitudeCategory quantCategory = categoryRepository.save(AptitudeCategory.builder()
                .name(CategoryType.QUANTITATIVE)
                .description("Mathematics and Quantitative Aptitude")
                .build());
            
            AptitudeCategory logicalCategory = categoryRepository.save(AptitudeCategory.builder()
                .name(CategoryType.LOGICAL_REASONING)
                .description("Logical Reasoning and Puzzles")
                .build());

            AptitudeCategory verbalCategory = categoryRepository.save(AptitudeCategory.builder()
                .name(CategoryType.VERBAL_ABILITY)
                .description("Grammar, Vocabulary, and Comprehension")
                .build());

            var pnlTopic = topicRepository.save(AptitudeTopic.builder()
                .category(quantCategory)
                .name("Profit and Loss")
                .description("Learn how to calculate profit, loss, and percentages.")
                .difficultyLevel(DifficultyLevel.MEDIUM)
                .formulaNotes("• Profit = Selling Price (SP) - Cost Price (CP)\n• Loss = Cost Price (CP) - Selling Price (SP)\n• Profit % = (Profit / CP) × 100\n• Loss % = (Loss / CP) × 100")
                .shortTricks("1. When two different articles are sold at the same selling price, getting profit of x% on the first and loss of x% on the second, the overall transaction always results in a loss of (x/10)²%.\n2. Always base profit/loss percentage on Cost Price unless specified otherwise.")
                .solvedExamples("**Example 1:** A man buys a pen for $20 and sells it for $25. Find his profit percentage.\n\n*Solution:*\nCP = $20, SP = $25\nProfit = SP - CP = $5\nProfit % = (5 / 20) × 100 = 25%\n\n**Example 2:** An article is sold at a loss of 10%. Had it been sold for $90 more, there would have been a gain of 5%. Find the CP.\n\n*Solution:*\nLet CP = 100x. Loss = 10x, SP1 = 90x.\nGain = 5x, SP2 = 105x.\nDifference = 105x - 90x = 15x.\nGiven 15x = 90 => x = 6.\nCP = 100 × 6 = $600.")
                .isActive(true)
                .build());

            var seriesTopic = topicRepository.save(AptitudeTopic.builder()
                .category(logicalCategory)
                .name("Number Series")
                .description("Identify patterns in number sequences.")
                .difficultyLevel(DifficultyLevel.EASY)
                .formulaNotes("Number series follow specific patterns. Common patterns include:\n• Arithmetic (constant difference)\n• Geometric (constant ratio)\n• Squares/Cubes\n• Fibonacci (sum of previous two)\n• Prime numbers\n• Alternate series")
                .shortTricks("1. Calculate the differences between consecutive terms.\n2. If the differences don't form a pattern, calculate the differences of the differences.\n3. Look for multiplication/division if numbers grow/shrink very fast.")
                .solvedExamples("**Example 1:** Find the next number in the series: 2, 5, 10, 17, 26, ?\n\n*Solution:*\nDifferences: 5-2=3, 10-5=5, 17-10=7, 26-17=9.\nThe differences are odd numbers (3, 5, 7, 9). Next difference = 11.\nNext number = 26 + 11 = 37.\n\n**Example 2:** 2, 6, 12, 20, 30, ?\n\n*Solution:*\nPattern is n² + n:\n1² + 1 = 2\n2² + 2 = 6\n3² + 3 = 12\nNext is 6² + 6 = 42.")
                .isActive(true)
                .build());

            var timeWork = topicRepository.save(AptitudeTopic.builder()
                .category(quantCategory)
                .name("Time and Work")
                .description("Calculate efficiency and time required for workers.")
                .difficultyLevel(DifficultyLevel.MEDIUM)
                .formulaNotes("• If A can do a piece of work in 'n' days, A's 1 day's work = 1/n.\n• If A is 'x' times as good a workman as B, then ratio of work done = x:1, and ratio of time taken = 1:x.\n• Total Work = Efficiency × Time\n• Chain Rule: M1×D1×H1/W1 = M2×D2×H2/W2 (where M=Men, D=Days, H=Hours, W=Work)")
                .shortTricks("1. LCM Method: Assume Total Work = LCM of given days. This avoids fractions.\n2. Efficiency is inversely proportional to time taken.")
                .solvedExamples("**Example 1:** A takes 10 days, B takes 15 days to do a work. If they work together, how long will it take?\n\n*Solution:*\nTotal Work = LCM(10,15) = 30 units.\nA's efficiency = 30/10 = 3 units/day.\nB's efficiency = 30/15 = 2 units/day.\nTotal efficiency = 3 + 2 = 5 units/day.\nTime taken = 30 / 5 = 6 days.\n\n**Example 2:** 10 men can build a wall in 8 days. How many men can build it in 5 days?\n\n*Solution:*\nM1×D1 = M2×D2\n10 × 8 = M2 × 5\n80 = 5 × M2 => M2 = 16 men.")
                .isActive(true)
                .build());

            var probability = topicRepository.save(AptitudeTopic.builder()
                .category(quantCategory)
                .name("Probability")
                .description("Understand odds and likelihoods.")
                .difficultyLevel(DifficultyLevel.HARD)
                .formulaNotes("• Probability P(E) = (Number of favorable outcomes) / (Total number of possible outcomes)\n• 0 ≤ P(E) ≤ 1\n• P(Event happens) + P(Event doesn't happen) = 1\n• 'AND' means Multiply (Independent events)\n• 'OR' means Add (Mutually exclusive events)")
                .shortTricks("1. Coins: Total outcomes for n coins = 2^n.\n2. Dice: Total outcomes for n dice = 6^n.\n3. Cards: Standard deck has 52 cards (4 suits, 13 ranks). Face cards = 12 (J, Q, K).")
                .solvedExamples("**Example 1:** Two coins are tossed. Find probability of at least one head.\n\n*Solution:*\nSample space = {HH, HT, TH, TT}. Total = 4.\nFavorable (at least 1 H) = {HH, HT, TH}. Count = 3.\nProbability = 3/4.\n\n**Example 2:** A bag has 3 red and 5 black balls. What is the probability of drawing a red ball?\n\n*Solution:*\nTotal balls = 3 + 5 = 8.\nRed balls = 3.\nProbability = 3/8.")
                .isActive(true)
                .build());

            var synonyms = topicRepository.save(AptitudeTopic.builder()
                .category(verbalCategory)
                .name("Synonyms & Antonyms")
                .description("Expand your vocabulary.")
                .difficultyLevel(DifficultyLevel.EASY)
                .formulaNotes("• Synonym: A word having the same or nearly the same meaning.\n• Antonym: A word opposite in meaning.\n• Context is key. Many words have different meanings based on the sentence.")
                .shortTricks("1. Look at the root of the word. Prefix (un-, in-, dis-) often indicates a negative or opposite meaning.\n2. Use the elimination method: rule out obvious incorrect options.\n3. Identify the part of speech. The synonym/antonym must match the part of speech of the given word.")
                .solvedExamples("**Example 1:** Choose the synonym for 'ABANDON'.\nA) Keep  B) Retain  C) Forsake  D) Assert\n\n*Solution:*\n'Abandon' means to leave completely. 'Forsake' is the closest meaning. Option C.\n\n**Example 2:** Choose the antonym for 'BENEVOLENT'.\nA) Kind  B) Malevolent  C) Generous  D) Friendly\n\n*Solution:*\n'Benevolent' means kind and well-meaning. 'Malevolent' means having or showing a wish to do evil to others. Option B.")
                .isActive(true)
                .build());

            questionRepository.saveAll(Arrays.asList(
                AptitudeQuestion.builder().topic(pnlTopic).questionText("If a toy is bought for $10 and sold for $15, what is the profit percentage?").optionA("20%").optionB("30%").optionC("50%").optionD("25%").correctOption("C").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.PRACTICE_ONLY).explanation("Profit = 15 - 10 = 5. Percentage = (5/10) * 100 = 50%.").isActive(true).build(),
                AptitudeQuestion.builder().topic(seriesTopic).questionText("Look at this series: 2, 1, (1/2), (1/4)... What number should come next?").optionA("(1/3)").optionB("(1/8)").optionC("(2/8)").optionD("(1/16)").correctOption("B").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.MOCK).explanation("Each number is one-half of the previous number.").isActive(true).build(),

                // TIME AND WORK (15 Questions)
                AptitudeQuestion.builder().topic(timeWork).questionText("A can do a piece of work in 10 days and B can do it in 15 days. How long will they take if both work together?").optionA("5 days").optionB("6 days").optionC("8 days").optionD("9 days").correctOption("B").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.PRACTICE_ONLY).explanation("Total work = LCM(10,15) = 30 units. A=3 units/day, B=2 units/day. 30/5 = 6 days.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("A and B together can complete a piece of work in 4 days. If A alone can complete the same work in 12 days, in how many days can B alone complete that work?").optionA("6 days").optionB("8 days").optionC("9 days").optionD("12 days").correctOption("A").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.MOCK).explanation("1/B = 1/4 - 1/12 = 3/12 - 1/12 = 2/12 = 1/6. B alone takes 6 days.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("A is twice as good a workman as B and together they finish a piece of work in 18 days. In how many days will A alone finish the work?").optionA("27 days").optionB("54 days").optionC("12 days").optionD("24 days").correctOption("A").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.PRACTICE_ONLY).explanation("Ratio of efficiency A:B = 2:1. Together = 3 units/day. Total = 54 units. A takes 54/2 = 27 days.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("A can finish a work in 18 days and B can do the same work in 15 days. B worked for 10 days and left the job. In how many days, A alone can finish the remaining work?").optionA("5").optionB("5.5").optionC("6").optionD("8").correctOption("C").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.MOCK).explanation("B's 10 day work = 10/15 = 2/3. Remaining = 1/3. A takes 18 * (1/3) = 6 days.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("A machine P can print one lakh books in 8 hours, machine Q can print the same number of books in 10 hours while machine R can print them in 12 hours. All the machines are started at 9 A.M. while machine P is closed at 11 A.M. and the remaining two machines complete work. Approximately at what time will the work be finished?").optionA("11:30 AM").optionB("12 noon").optionC("12:30 PM").optionD("1:00 PM").correctOption("D").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.PRACTICE_ONLY).explanation("Work done by P, Q, R in 2 hrs = 2*(1/8 + 1/10 + 1/12) = 37/60. Remaining = 23/60. Q and R 1 hr work = 11/60. 23/11 hours ~ 2 hours. So 1 PM.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("A works twice as fast as B. If B can complete a work in 12 days independently, the number of days in which A and B can together finish the work in:").optionA("4 days").optionB("6 days").optionC("8 days").optionD("18 days").correctOption("A").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.MOCK).explanation("A takes 6 days. Together: (1/6 + 1/12) = 3/12 = 1/4. 4 days.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("Twenty women can do a work in sixteen days. Sixteen men can complete the same work in fifteen days. What is the ratio between the capacity of a man and a woman?").optionA("3:4").optionB("4:3").optionC("5:3").optionD("Data inadequate").correctOption("B").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.PRACTICE_ONLY).explanation("20W * 16 = 16M * 15 => 320W = 240M => M/W = 320/240 = 4/3.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("A and B can complete a work in 15 days and 10 days respectively. They started doing the work together but after 2 days B had to leave and A alone completed the remaining work. The whole work was completed in:").optionA("8 days").optionB("10 days").optionC("12 days").optionD("15 days").correctOption("C").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.MOCK).explanation("Work by A and B in 2 days = 2*(1/15 + 1/10) = 1/3. Remaining = 2/3. A does 2/3 in 10 days. Total = 10 + 2 = 12 days.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("A can do a certain work in the same time in which B and C together can do it. If A and B together could do it in 10 days and C alone in 50 days, then B alone could do it in:").optionA("15 days").optionB("20 days").optionC("25 days").optionD("30 days").correctOption("C").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.PRACTICE_ONLY).explanation("A = B + C. A + B = 1/10. C = 1/50. (B+C)+B = 1/10 => 2B + 1/50 = 1/10 => 2B = 4/50 => B = 2/50 = 1/25. 25 days.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("10 men can complete a piece of work in 15 days and 15 women can complete the same work in 12 days. If all the 10 men and 15 women work together, in how many days will the work get completed?").optionA("6").optionB("6 1/3").optionC("6 2/3").optionD("7 2/3").correctOption("C").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.MOCK).explanation("10 men = 1/15. 15 women = 1/12. Together = 1/15 + 1/12 = 9/60 = 3/20. 20/3 = 6 2/3 days.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("X and Y can do a piece of work in 20 days and 12 days respectively. X started the work alone and then after 4 days Y joined him till the completion of the work. How long did the work last?").optionA("6 days").optionB("10 days").optionC("15 days").optionD("20 days").correctOption("B").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.PRACTICE_ONLY).explanation("X worked 4 days = 4/20 = 1/5. Remaining = 4/5. X+Y = 1/20 + 1/12 = 8/60 = 2/15. (4/5) / (2/15) = 6 days. Total = 4+6 = 10 days.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("A is 30% more efficient than B. How much time will they, working together, take to complete a job which A alone could have done in 23 days?").optionA("11 days").optionB("13 days").optionC("20 3/17 days").optionD("None of these").correctOption("B").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.MOCK).explanation("Ratio of times A:B = 100:130 = 10:13. If A takes 23 days, B takes 23*13/10 = 29.9 days. Total efficiency = 1/23 + 10/299 = 23/299 = 1/13. 13 days.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("Ravi and Kumar are working on an assignment. Ravi takes 6 hours to type 32 pages on a computer, while Kumar takes 5 hours to type 40 pages. How much time will they take, working together on two different computers to type an assignment of 110 pages?").optionA("7 hours 30 minutes").optionB("8 hours").optionC("8 hours 15 minutes").optionD("8 hours 25 minutes").correctOption("C").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.PRACTICE_ONLY).explanation("Ravi = 32/6 = 16/3 pages/hr. Kumar = 40/5 = 8 pages/hr. Together = 16/3 + 8 = 40/3 pages/hr. 110 / (40/3) = 330/40 = 8.25 hours = 8 hrs 15 mins.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("If 6 men and 8 boys can do a piece of work in 10 days while 26 men and 48 boys can do the same in 2 days, the time taken by 15 men and 20 boys in doing the same type of work will be:").optionA("4 days").optionB("5 days").optionC("6 days").optionD("7 days").correctOption("A").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.MOCK).explanation("10(6m+8b) = 2(26m+48b) => 60m+80b = 52m+96b => 8m=16b => 1m=2b. 6m+8b = 12b+8b=20b. 20b take 10 days. 15m+20b = 30b+20b=50b. 50b take (20*10)/50 = 4 days.").isActive(true).build(),
                AptitudeQuestion.builder().topic(timeWork).questionText("A, B and C can do a piece of work in 20, 30 and 60 days respectively. In how many days can A do the work if he is assisted by B and C on every third day?").optionA("12 days").optionB("15 days").optionC("16 days").optionD("18 days").correctOption("B").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.PRACTICE_ONLY).explanation("A's 2 day work = 2/20 = 1/10. (A+B+C)'s 1 day work = 1/20 + 1/30 + 1/60 = 6/60 = 1/10. Work in 3 days = 1/10 + 1/10 = 1/5. 5 * 3 days = 15 days.").isActive(true).build(),

                // PROBABILITY (15 Questions)
                AptitudeQuestion.builder().topic(probability).questionText("What is the probability of getting a sum 9 from two throws of a dice?").optionA("1/6").optionB("1/8").optionC("1/9").optionD("1/12").correctOption("C").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.PRACTICE_ONLY).explanation("Favorable: (3,6), (4,5), (5,4), (6,3). Total=36. 4/36 = 1/9.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("Three unbiased coins are tossed. What is the probability of getting at most two heads?").optionA("3/4").optionB("1/4").optionC("3/8").optionD("7/8").correctOption("D").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.MOCK).explanation("Total outcomes=8. 'At most two heads' means everything except 3 heads. 7/8.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("Two dice are thrown simultaneously. What is the probability of getting two numbers whose product is even?").optionA("1/2").optionB("3/4").optionC("3/8").optionD("5/16").correctOption("B").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.PRACTICE_ONLY).explanation("Product is odd only when both are odd. Probability of odd*odd = (3/6)*(3/6) = 1/4. Probability of even = 1 - 1/4 = 3/4.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("In a class, there are 15 boys and 10 girls. Three students are selected at random. The probability that 1 girl and 2 boys are selected, is:").optionA("21/46").optionB("25/117").optionC("1/50").optionD("3/25").correctOption("A").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.MOCK).explanation("Number of ways = (15C2 * 10C1) / 25C3 = (105 * 10) / 2300 = 1050/2300 = 21/46.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("Tickets numbered 1 to 20 are mixed up and then a ticket is drawn at random. What is the probability that the ticket drawn has a number which is a multiple of 3 or 5?").optionA("1/2").optionB("2/5").optionC("8/15").optionD("9/20").correctOption("D").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.PRACTICE_ONLY).explanation("Multiples of 3: 3,6,9,12,15,18 (6). Multiples of 5: 5,10,15,20 (4). Common: 15. Total distinct = 6+4-1=9. Probability = 9/20.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("A bag contains 2 red, 3 green and 2 blue balls. Two balls are drawn at random. What is the probability that none of the balls drawn is blue?").optionA("10/21").optionB("11/21").optionC("2/7").optionD("5/7").correctOption("A").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.MOCK).explanation("Total balls = 7. Blue = 2. Non-blue = 5. Ways to draw 2 non-blue = 5C2 = 10. Total ways = 7C2 = 21. Probability = 10/21.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("In a lottery, there are 10 prizes and 25 blanks. A lottery is drawn at random. What is the probability of getting a prize?").optionA("1/10").optionB("2/5").optionC("2/7").optionD("5/7").correctOption("C").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.PRACTICE_ONLY).explanation("Total tickets = 10+25 = 35. Prizes = 10. Probability = 10/35 = 2/7.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("From a pack of 52 cards, two cards are drawn together at random. What is the probability of both the cards being kings?").optionA("1/15").optionB("25/57").optionC("35/256").optionD("1/221").correctOption("D").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.MOCK).explanation("Kings = 4. Ways = 4C2 / 52C2 = 6 / 1326 = 1/221.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("Two dice are tossed. The probability that the total score is a prime number is:").optionA("1/6").optionB("5/12").optionC("1/2").optionD("7/9").correctOption("B").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.PRACTICE_ONLY).explanation("Prime sums: 2, 3, 5, 7, 11. Outcomes: (1,1), (1,2), (2,1), (1,4), (2,3), (3,2), (4,1), (1,6), (2,5), (3,4), (4,3), (5,2), (6,1), (5,6), (6,5). Total 15. 15/36 = 5/12.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("A card is drawn from a pack of 52 cards. The probability of getting a queen of club or a king of heart is:").optionA("1/13").optionB("2/13").optionC("1/26").optionD("1/52").correctOption("C").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.MOCK).explanation("Only 1 queen of club and 1 king of heart. Prob = 2/52 = 1/26.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("One card is drawn at random from a pack of 52 cards. What is the probability that the card drawn is a face card (Jack, Queen and King only)?").optionA("1/13").optionB("3/13").optionC("1/4").optionD("9/52").correctOption("B").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.PRACTICE_ONLY).explanation("Face cards = 3 * 4 = 12. Probability = 12/52 = 3/13.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("A bag contains 6 black and 8 white balls. One ball is drawn at random. What is the probability that the ball drawn is white?").optionA("3/4").optionB("4/7").optionC("1/8").optionD("3/7").correctOption("B").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.MOCK).explanation("Total = 14. White = 8. Prob = 8/14 = 4/7.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("Two cards are drawn together from a pack of 52 cards. The probability that one is a spade and one is a heart, is:").optionA("3/20").optionB("29/34").optionC("47/100").optionD("13/102").correctOption("D").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.PRACTICE_ONLY).explanation("Ways = 13C1 * 13C1 / 52C2 = (13*13)/1326 = 169/1326 = 13/102.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("If a number is chosen at random from the numbers 1 to 50, what is the probability that it is a prime number?").optionA("3/10").optionB("1/5").optionC("7/25").optionD("1/2").correctOption("A").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.MOCK).explanation("Primes under 50: 2,3,5,7,11,13,17,19,23,29,31,37,41,43,47. Total = 15. Prob = 15/50 = 3/10.").isActive(true).build(),
                AptitudeQuestion.builder().topic(probability).questionText("Three unbiased coins are tossed. What is the probability of getting exactly two heads?").optionA("1/8").optionB("1/4").optionC("3/8").optionD("1/2").correctOption("C").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.PRACTICE_ONLY).explanation("Outcomes with exactly two heads: HHT, HTH, THH (3). Total outcomes = 8. Prob = 3/8.").isActive(true).build(),

                // SYNONYMS & ANTONYMS (15 Questions)
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the exact synonym for 'OBSCURE'").optionA("Clear").optionB("Unknown").optionC("Famous").optionD("Transparent").correctOption("B").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.PRACTICE_ONLY).explanation("Obscure means not discovered or known about; uncertain.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the exact antonym for 'CANDID'").optionA("Frank").optionB("Blunt").optionC("Deceitful").optionD("Truthful").correctOption("C").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.PRACTICE_ONLY).explanation("Candid means truthful and straightforward. Deceitful is the opposite.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the synonym for 'ELOQUENT'").optionA("Silent").optionB("Articulate").optionC("Confusing").optionD("Boring").correctOption("B").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.PRACTICE_ONLY).explanation("Eloquent means fluent or persuasive in speaking or writing, which matches articulate.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the synonym for 'LUCID'").optionA("Obscure").optionB("Clear").optionC("Confusing").optionD("Dark").correctOption("B").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.MOCK).explanation("Lucid means expressed clearly; easy to understand.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the antonym for 'EPHEMERAL'").optionA("Short-lived").optionB("Permanent").optionC("Temporary").optionD("Brief").correctOption("B").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.MOCK).explanation("Ephemeral means lasting for a very short time. Permanent is the opposite.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the synonym for 'MITIGATE'").optionA("Aggravate").optionB("Alleviate").optionC("Increase").optionD("Intensify").correctOption("B").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.PRACTICE_ONLY).explanation("Mitigate means to make less severe, serious, or painful. Alleviate is a synonym.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the antonym for 'GREGARIOUS'").optionA("Sociable").optionB("Outgoing").optionC("Introverted").optionD("Friendly").correctOption("C").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.MOCK).explanation("Gregarious means fond of company; sociable. Introverted is the opposite.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the synonym for 'TENACIOUS'").optionA("Yielding").optionB("Persistent").optionC("Weak").optionD("Fragile").correctOption("B").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.PRACTICE_ONLY).explanation("Tenacious means tending to keep a firm hold of something; clinging or adhering closely. Persistent is a synonym.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the antonym for 'PROLIFIC'").optionA("Productive").optionB("Barren").optionC("Abundant").optionD("Fertile").correctOption("B").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.MOCK).explanation("Prolific means producing much fruit or foliage or many offspring. Barren is the opposite.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the synonym for 'PRAGMATIC'").optionA("Idealistic").optionB("Practical").optionC("Theoretical").optionD("Unrealistic").correctOption("B").difficulty(DifficultyLevel.MEDIUM).questionType(QuestionMode.PRACTICE_ONLY).explanation("Pragmatic means dealing with things sensibly and realistically. Practical is a synonym.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the antonym for 'AMBIGUOUS'").optionA("Clear").optionB("Vague").optionC("Uncertain").optionD("Obscure").correctOption("A").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.MOCK).explanation("Ambiguous means open to more than one interpretation. Clear is the opposite.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the synonym for 'BENEVOLENT'").optionA("Cruel").optionB("Kind").optionC("Malevolent").optionD("Unkind").correctOption("B").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.PRACTICE_ONLY).explanation("Benevolent means well meaning and kindly.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the antonym for 'CACOPHONY'").optionA("Noise").optionB("Harmony").optionC("Discord").optionD("Clatter").correctOption("B").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.MOCK).explanation("Cacophony means a harsh discordant mixture of sounds. Harmony is the opposite.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the synonym for 'SANGUINE'").optionA("Optimistic").optionB("Pessimistic").optionC("Depressed").optionD("Sad").correctOption("A").difficulty(DifficultyLevel.HARD).questionType(QuestionMode.PRACTICE_ONLY).explanation("Sanguine means optimistic or positive, especially in an apparently bad or difficult situation.").isActive(true).build(),
                AptitudeQuestion.builder().topic(synonyms).questionText("Choose the antonym for 'DILIGENT'").optionA("Hardworking").optionB("Lazy").optionC("Careful").optionD("Attentive").correctOption("B").difficulty(DifficultyLevel.EASY).questionType(QuestionMode.MOCK).explanation("Diligent means having or showing care and conscientiousness in one's work or duties. Lazy is the opposite.").isActive(true).build()
            ));
        }

        if (codingProblemRepository.count() < 5) {
            System.out.println("Seeding Coding Problems...");
            
            CodingProblem twoSum = CodingProblem.builder()
                    .title("Two Sum")
                    .description("Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.")
                    .difficulty(DifficultyLevel.EASY)
                    .tags("Arrays,Hash Table")
                    .skeletonCodeJava("class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // TODO: Implement your solution here\n        return new int[]{};\n    }\n}")
                    .skeletonCodePython("class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # TODO: Implement your solution here\n        pass")
                    .skeletonCodeCpp("class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // TODO: Implement your solution here\n        return {};\n    }\n};")
                    .build();
            twoSum = codingProblemRepository.save(twoSum);

            testCaseRepository.save(TestCase.builder()
                    .problem(twoSum)
                    .inputData("nums = [2,7,11,15], target = 9")
                    .expectedOutput("[0,1]")
                    .isHidden(false)
                    .build());
            testCaseRepository.save(TestCase.builder()
                    .problem(twoSum)
                    .inputData("nums = [3,2,4], target = 6")
                    .expectedOutput("[1,2]")
                    .isHidden(false)
                    .build());
            testCaseRepository.save(TestCase.builder()
                    .problem(twoSum)
                    .inputData("nums = [3,3], target = 6")
                    .expectedOutput("[0,1]")
                    .isHidden(true)
                    .build());
            
            // Problem 2: Valid Palindrome (LeetCode Easy)
            CodingProblem palindrome = CodingProblem.builder()
                    .title("Valid Palindrome")
                    .description("A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.")
                    .difficulty(DifficultyLevel.EASY)
                    .tags("Two Pointers,String")
                    .skeletonCodeJava("class Solution {\n    public boolean isPalindrome(String s) {\n        // TODO: Implement your solution here\n        return false;\n    }\n}")
                    .skeletonCodePython("class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        # TODO: Implement your solution here\n        pass")
                    .skeletonCodeCpp("class Solution {\npublic:\n    bool isPalindrome(string s) {\n        // TODO: Implement your solution here\n        return false;\n    }\n};")
                    .build();
            palindrome = codingProblemRepository.save(palindrome);

            testCaseRepository.save(TestCase.builder()
                    .problem(palindrome)
                    .inputData("s = \"A man, a plan, a canal: Panama\"")
                    .expectedOutput("true")
                    .isHidden(false)
                    .build());
            testCaseRepository.save(TestCase.builder()
                    .problem(palindrome)
                    .inputData("s = \"race a car\"")
                    .expectedOutput("false")
                    .isHidden(false)
                    .build());

            // Problem 3: Longest Substring Without Repeating Characters (LeetCode Medium)
            CodingProblem longestSubstring = CodingProblem.builder()
                    .title("Longest Substring Without Repeating Characters")
                    .description("Given a string `s`, find the length of the longest substring without repeating characters.")
                    .difficulty(DifficultyLevel.MEDIUM)
                    .tags("Hash Table,String,Sliding Window")
                    .skeletonCodeJava("class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // TODO: Implement your solution here\n        return 0;\n    }\n}")
                    .skeletonCodePython("class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # TODO: Implement your solution here\n        pass")
                    .skeletonCodeCpp("class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // TODO: Implement your solution here\n        return 0;\n    }\n};")
                    .build();
            longestSubstring = codingProblemRepository.save(longestSubstring);

            testCaseRepository.save(TestCase.builder()
                    .problem(longestSubstring)
                    .inputData("s = \"abcabcbb\"")
                    .expectedOutput("3")
                    .isHidden(false)
                    .build());
            testCaseRepository.save(TestCase.builder()
                    .problem(longestSubstring)
                    .inputData("s = \"bbbbb\"")
                    .expectedOutput("1")
                    .isHidden(false)
                    .build());
            testCaseRepository.save(TestCase.builder()
                    .problem(longestSubstring)
                    .inputData("s = \"pwwkew\"")
                    .expectedOutput("3")
                    .isHidden(true)
                    .build());

            // Problem 4: Merge Intervals (LeetCode Medium)
            CodingProblem mergeIntervals = CodingProblem.builder()
                    .title("Merge Intervals")
                    .description("Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.")
                    .difficulty(DifficultyLevel.MEDIUM)
                    .tags("Array,Sorting")
                    .skeletonCodeJava("class Solution {\n    public int[][] merge(int[][] intervals) {\n        // TODO: Implement your solution here\n        return new int[][]{};\n    }\n}")
                    .skeletonCodePython("class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        # TODO: Implement your solution here\n        pass")
                    .skeletonCodeCpp("class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // TODO: Implement your solution here\n        return {};\n    }\n};")
                    .build();
            mergeIntervals = codingProblemRepository.save(mergeIntervals);

            testCaseRepository.save(TestCase.builder()
                    .problem(mergeIntervals)
                    .inputData("intervals = [[1,3],[2,6],[8,10],[15,18]]")
                    .expectedOutput("[[1,6],[8,10],[15,18]]")
                    .isHidden(false)
                    .build());
            testCaseRepository.save(TestCase.builder()
                    .problem(mergeIntervals)
                    .inputData("intervals = [[1,4],[4,5]]")
                    .expectedOutput("[[1,5]]")
                    .isHidden(false)
                    .build());
            
            // Problem 5: Median of Two Sorted Arrays (LeetCode Hard)
            CodingProblem medianArrays = CodingProblem.builder()
                    .title("Median of Two Sorted Arrays")
                    .description("Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.")
                    .difficulty(DifficultyLevel.HARD)
                    .tags("Array,Binary Search,Divide and Conquer")
                    .skeletonCodeJava("class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // TODO: Implement your solution here\n        return 0.0;\n    }\n}")
                    .skeletonCodePython("class Solution:\n    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:\n        # TODO: Implement your solution here\n        pass")
                    .skeletonCodeCpp("class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // TODO: Implement your solution here\n        return 0.0;\n    }\n};")
                    .build();
            medianArrays = codingProblemRepository.save(medianArrays);

            testCaseRepository.save(TestCase.builder()
                    .problem(medianArrays)
                    .inputData("nums1 = [1,3], nums2 = [2]")
                    .expectedOutput("2.00000")
                    .isHidden(false)
                    .build());
            testCaseRepository.save(TestCase.builder()
                    .problem(medianArrays)
                    .inputData("nums1 = [1,2], nums2 = [3,4]")
                    .expectedOutput("2.50000")
                    .isHidden(false)
                    .build());
        }

        // Clean up previously generated mock data so they are replaced by real titles
        codingProblemRepository.findAll().forEach(p -> {
            if (p.getTitle() != null && p.getTitle().startsWith("Coding Practice Problem")) {
                codingProblemRepository.delete(p);
            }
        });

        // Generate remaining problems up to 50
        long currentCount = codingProblemRepository.count();
        if (currentCount < 50) {
            System.out.println("Generating actual unique coding problems to reach 50...");
            String[] problemTitles = {
                "Reverse Integer", "String to Integer (atoi)", "Palindrome Number", "Regular Expression Matching", "Container With Most Water",
                "Integer to Roman", "Roman to Integer", "Longest Common Prefix", "3Sum", "3Sum Closest",
                "Letter Combinations of a Phone Number", "4Sum", "Remove Nth Node From End of List", "Valid Parentheses", "Merge Two Sorted Lists",
                "Generate Parentheses", "Merge k Sorted Lists", "Swap Nodes in Pairs", "Reverse Nodes in k-Group", "Remove Duplicates from Sorted Array",
                "Remove Element", "Find the Index of the First Occurrence in a String", "Divide Two Integers", "Substring with Concatenation of All Words", "Next Permutation",
                "Longest Valid Parentheses", "Search in Rotated Sorted Array", "Find First and Last Position of Element in Sorted Array", "Valid Sudoku", "Sudoku Solver",
                "Count and Say", "Combination Sum", "Combination Sum II", "First Missing Positive", "Trapping Rain Water",
                "Multiply Strings", "Wildcard Matching", "Jump Game II", "Permutations", "Permutations II",
                "Rotate Image", "Group Anagrams", "Pow(x, n)", "N-Queens", "Spiral Matrix"
            };
            
            for (int i = 0; i < problemTitles.length; i++) {
                // If we already have enough, stop
                if (codingProblemRepository.count() >= 50) break;
                
                String title = problemTitles[i];
                DifficultyLevel diff = (i % 4 == 0) ? DifficultyLevel.HARD : ((i % 2 == 0) ? DifficultyLevel.MEDIUM : DifficultyLevel.EASY);
                String tag = (i % 3 == 0) ? "Dynamic Programming,Math" : (i % 2 == 0 ? "Array,Two Pointers" : "String,Hash Table");
                
                CodingProblem extraProblem = CodingProblem.builder()
                        .title(title)
                        .description("Given the specific constraints of the classic **" + title + "** problem, design an algorithm to solve it optimally.\n\n### Requirements:\n- Consider edge cases like empty inputs, negative numbers, or overflow.\n- Ensure your solution meets the `O(N)` or `O(N log N)` time complexity expectations for " + diff.name() + " level problems.\n\nReturn the appropriate output based on the standard problem statement.")
                        .difficulty(diff)
                        .tags(tag)
                        .skeletonCodeJava("class Solution {\n    public void solve() {\n        // TODO: Implement your solution for " + title + " here\n    }\n}")
                        .skeletonCodePython("class Solution:\n    def solve(self):\n        # TODO: Implement your solution for " + title + " here\n        pass")
                        .skeletonCodeCpp("class Solution {\npublic:\n    void solve() {\n        // TODO: Implement your solution for " + title + " here\n    }\n};")
                        .build();
                codingProblemRepository.save(extraProblem);
            }
        }
    }
}
